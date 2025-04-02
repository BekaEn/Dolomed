import { Reporter, TestCase, TestResult, FullResult, Suite } from '@playwright/test/reporter';
import path from 'path';
import fs from 'fs';

interface StoredResult {
  test: TestCase;
  result: TestResult;
}

class CustomReporter implements Reporter {
  private results: Map<string, StoredResult[]> = new Map();
  private reportDir: string;

  constructor(options: any = {}) {
    // Handle both string and object configuration
    this.reportDir = typeof options === 'string' 
      ? options 
      : (options?.outputDir || options?.reportDir || 'test-results');
    
    // Ensure it's a string
    if (typeof this.reportDir !== 'string') {
      this.reportDir = 'test-results';
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const testKey = this.getTestKey(test);
    const results = this.results.get(testKey) || [];
    results.push({ test, result });
    this.results.set(testKey, results);
  }

  private getTestKey(test: TestCase): string {
    // Create a key based on file path and test title to group related tests
    const filePath = test.location.file.replace(/^.*?tests\//, '');
    const parentTitle = test.parent?.title || '';
    return `${filePath}|${parentTitle}|${test.title.split(' ')[0]}`;
  }

  async onEnd(result?: FullResult) {
    try {
      // Ensure reportDir is a valid string
      const outputDir = path.resolve(this.reportDir);
      
      // Create directory if it doesn't exist
      await fs.promises.mkdir(outputDir, { recursive: true });

      const html = this.generateHTML();
      const reportPath = path.join(outputDir, 'custom-report.html');
      
      await fs.promises.writeFile(reportPath, html);
      console.log(`Visual regression report generated at: ${reportPath}`);
    } catch (error) {
      console.error('Error generating custom report:', error);
    }
  }

  private getRelativePath(fullPath: string): string {
    if (!fullPath) return '';
    return fullPath.replace(/^.*?test-results\//, '');
  }

  private generateHTML(): string {
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Visual Regression Test Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .test-case { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
            .status-badge { padding: 3px 8px; border-radius: 3px; font-size: 12px; }
            .status-failed { background: #ff4444; color: white; }
            .status-passed { background: #4CAF50; color: white; }
            .viewport-comparison { display: flex; gap: 20px; margin-top: 10px; }
            .viewport-container { flex: 1; }
            .filter-controls { margin-bottom: 20px; }
            .filter-button { 
              margin-right: 10px;
              padding: 5px 15px;
              border: 1px solid #ddd;
              border-radius: 3px;
              cursor: pointer;
            }
            .filter-button.active {
              background: #007bff;
              color: white;
              border-color: #0056b3;
            }
            .modal {
              display: none;
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0,0,0,0.8);
            }
            .modal-content {
              max-width: 90%;
              max-height: 90%;
              margin: auto;
              display: block;
              position: relative;
              top: 50%;
              transform: translateY(-50%);
            }
            .close {
              position: absolute;
              right: 25px;
              top: 10px;
              color: white;
              font-size: 35px;
              cursor: pointer;
            }
            .modal-title {
              color: white;
              text-align: center;
              position: absolute;
              bottom: 20px;
              width: 100%;
            }
          </style>
        </head>
        <body>
          <h1>Visual Regression Test Report</h1>
          
          <div class="filter-controls">
            <button class="filter-button active" data-filter="all">All Tests</button>
            <button class="filter-button" data-filter="failed">Failed Tests</button>
            <button class="filter-button" data-filter="passed">Passed Tests</button>
          </div>

          <div id="test-cases">
    `;

    // Group results by test file
    const testGroups = new Map<string, Map<string, StoredResult[]>>();
    
    for (const [testKey, results] of this.results.entries()) {
      const [filePath, parentTitle] = testKey.split('|');
      const groupKey = `${filePath}|${parentTitle}`;
      
      if (!testGroups.has(groupKey)) {
        testGroups.set(groupKey, new Map<string, StoredResult[]>());
      }
      
      const group = testGroups.get(groupKey)!;
      group.set(testKey, results);
    }
    
    // Process each group
    for (const [groupKey, tests] of testGroups.entries()) {
      const [filePath, parentTitle] = groupKey.split('|');
      
      // Check if any test in the group failed
      let hasFailedTest = false;
      for (const results of tests.values()) {
        if (results.some(r => r.result.status === 'failed')) {
          hasFailedTest = true;
          break;
        }
      }
      
      const status = hasFailedTest ? 'failed' : 'passed';
      
      html += `
        <div class="test-case" data-status="${status}">
          <h3>
            ${filePath}
            <span class="status-badge status-${status}">${status.toUpperCase()}</span>
            <span style="font-size: 12px; color: #666; margin-left: 10px;">${parentTitle}</span>
          </h3>
          <div class="viewport-comparison">
      `;

      // Process each view type (desktop/mobile)
      for (const [testKey, results] of tests.entries()) {
        const viewType = results[0].test.title.includes('Desktop') ? 'Desktop View' : 'Mobile View';
        const result = results[0].result;
        const viewStatus = result.status === 'failed' ? 'failed' : 'passed';
        
        html += `
          <div class="viewport-container">
            <h4>${viewType} <span class="status-badge status-${viewStatus}" style="font-size: 10px;">${viewStatus.toUpperCase()}</span></h4>
        `;
        
        if (result.attachments && result.attachments.length > 0) {
          // Find diff image first, fallback to actual
          let attachment = result.attachments.find(a => a.path?.includes('diff-'));
          if (!attachment) {
            attachment = result.attachments.find(a => a.path?.includes('actual-'));
          }
          
          if (attachment && attachment.path) {
            const imagePath = this.getRelativePath(attachment.path);
            html += `
              <img src="${imagePath}" 
                   alt="${viewType}" 
                   style="width: 70px; height: 70px; object-fit: cover;" 
                   onclick="openModal('${imagePath}', '${viewType}')" 
                   onerror="console.error('Failed to load image:', this.src)">
            `;
          } else {
            html += `<p>No image available</p>`;
          }
        } else {
          html += `<p>No attachments</p>`;
        }
        
        html += `</div>`;
      }
      
      html += `
          </div>
        </div>
      `;
    }

    html += `
        </div>

        <div id="imageModal" class="modal">
          <span class="close">&times;</span>
          <img id="modalImage" class="modal-content">
          <div id="modalTitle" class="modal-title"></div>
        </div>

        <script>
          function openModal(imagePath, title) {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            const modalTitle = document.getElementById('modalTitle');
            modal.style.display = "block";
            modalImg.src = imagePath;
            modalTitle.textContent = title;
          }

          document.querySelector('.close').onclick = function() {
            document.getElementById('imageModal').style.display = "none";
          }

          // Filter functionality
          document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', function() {
              const filter = this.dataset.filter;
              
              // Update active button
              document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
              this.classList.add('active');
              
              // Filter test cases
              document.querySelectorAll('.test-case').forEach(testCase => {
                if (filter === 'all' || testCase.dataset.status === filter) {
                  testCase.style.display = 'block';
                } else {
                  testCase.style.display = 'none';
                }
              });
            });
          });
        </script>
      </body>
      </html>
    `;

    return html;
  }
}

export default CustomReporter;