pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS_PATH = '0'
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1'
        PLAYWRIGHT_SKIP_DEPS_INSTALLATION = '1'
        GIT_SSL_NO_VERIFY = 'true'
        GIT_USERNAME = 'dartera'
        GITHUB_TOKEN = credentials('github-token')
        PATH = "/usr/local/bin:${env.PATH}"
        PLAYWRIGHT_TEST_REPORT_DIR = "playwright-report"
        PLAYWRIGHT_TEST_RESULTS_DIR = "test-results"
        ALLURE_RESULTS_DIR = "allure-results"
        CLICKUP_API_TOKEN = credentials('clickup-api-token')
        CLICKUP_PARENT_TASK_ID = '8698ty0vg'  // Updated with the new task ID
        CLICKUP_USER_ID = '87801653'  // Your ClickUp user ID from the API response
        DEBIAN_FRONTEND = "noninteractive"
    }

    options {
        // timeout(time: 30, unit: 'MINUTES')
        // retry(3)
        skipDefaultCheckout()
    }

    tools {
        allure 'Allure'
    }

    stages {
        stage('Verify Sudo') {
            steps {
                sh '''
                    # Check if sudo works without password
                    sudo -n true
                    echo "Sudo privileges confirmed without password"
                '''
            }
        }
        
        stage('Setup Git LFS') {
            steps {
                sh '''
                    # Install Git LFS using apt
                    export DEBIAN_FRONTEND=noninteractive
                    sudo -E apt-get update -y
                    sudo -E apt-get install -y git-lfs
                    
                    # Verify Git LFS installation
                    which git-lfs
                    git-lfs version
                    
                    # Initialize Git LFS
                    git-lfs install
                    
                    # Configure Git LFS
                    git config --global filter.lfs.clean "git-lfs clean -- %f"
                    git config --global filter.lfs.smudge "git-lfs smudge -- %f"
                    git config --global filter.lfs.process "git-lfs filter-process"
                    git config --global filter.lfs.required true
                    
                    # Configure Git credentials
                    git config --global user.name "${GIT_USERNAME}"
                    git config --global credential.helper store
                    echo "https://${GIT_USERNAME}:${GITHUB_TOKEN}@github.com" > ~/.git-credentials
                '''
            }
        }

        stage('Checkout') {
            steps {
                // retry(3) {
                    sh '''
                        # Clean workspace before cloning
                        rm -rf .* * 2>/dev/null || true
                        
                        # Clone the repository using HTTPS with token
                        git clone "https://${GIT_USERNAME}:${GITHUB_TOKEN}@github.com/dartera/DolomedAutomation.git" .
                        
                        # Initialize Git LFS in the repository
                        git lfs install
                        
                        # Pull LFS files
                        git lfs pull
                    '''
                // }
            }
        }

        stage('Setup Node.js') {
            steps {
                sh '''
                    # Install Node.js using NodeSource repository
                    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                    sudo -E apt-get install -y nodejs
                    
                    # Verify Node.js installation
                    node --version
                    npm --version
                    
                    # Install yarn using npm
                    sudo npm install -g yarn
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    # Install dependencies
                    npm install
                    
                    # Install Playwright browsers
                    npx playwright install --with-deps
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    # Run tests with Allure reporting
                    npm run test:allure || true  # Continue even if tests fail
                    
                    # Retry failed tests up to 3 times
                    for i in {1..3}; do
                        echo "Retry attempt $i of 3 for failed tests..."
                        if [ -d "${PLAYWRIGHT_TEST_RESULTS_DIR}" ] && grep -q "failed" ${PLAYWRIGHT_TEST_RESULTS_DIR}/report.json 2>/dev/null; then
                            npx playwright test --last-failed || true
                        else
                            echo "No failed tests to retry or results directory not found."
                            break
                        fi
                    done
                '''
            }
            post {
                always {
                    script {
                       allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
  
                        
                        // Create ZIP with all reports
                        sh """
                            zip -r test-reports.zip \\
                                ${PLAYWRIGHT_TEST_REPORT_DIR}/ \\
                                ${PLAYWRIGHT_TEST_RESULTS_DIR}/ \\
                                ${ALLURE_RESULTS_DIR}/ || true
                        """
                        
                        // Send email with test reports
                        emailext (
                            subject: "Test Report: ${currentBuild.fullDisplayName}",
                            body: """
                                <h2>Test Execution Summary</h2>
                                <p>Status: ${currentBuild.currentResult}</p>
                                <p>Build URL: <a href="${BUILD_URL}">${BUILD_URL}</a></p>
                                <p>Allure Report: <a href="${BUILD_URL}allure">${BUILD_URL}allure</a></p>
                                
                                <h3>Test Results:</h3>
                                <pre>
                                ${sh(script: "cat ${PLAYWRIGHT_TEST_RESULTS_DIR}/junit-results.xml | grep -A 1 'testsuite' || echo 'No test results available'", returnStdout: true)}
                                </pre>
                                
                                <p>Please find detailed test reports in the attachments.</p>
                            """,
                            to: "enuqidzebeqa@gmail.com",
                            attachmentsPattern: 'test-reports.zip',
                            mimeType: 'text/html',
                            attachLog: true
                        )
                    }
                }
            }
        }

        stage('Generate Reports') {
            steps {
                sh '''
                    # Generate Allure report using the full path to the Allure executable
                    ALLURE_PATH=$(which allure || echo "/var/lib/jenkins/tools/ru.yandex.qatools.allure.jenkins.tools.AllureCommandlineInstallation/Allure/bin/allure")
                    
                    if [ -x "$ALLURE_PATH" ]; then
                        "$ALLURE_PATH" generate allure-results -o allure-report --clean
                    else
                        echo "Allure executable not found. Skipping report generation."
                        # Create empty report directory to avoid post-build failures
                        mkdir -p allure-report
                    fi
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: "allure-report/**/*"
                }
            }
        }
        
        stage('Create ClickUp Task') {
            when {
                // Run this stage even if previous stages failed, but don't run if SKIP_CLICKUP is true
                not {
                    environment name: 'SKIP_CLICKUP', value: 'true'
                }
            }
            steps {
                script {
                    def testResult = currentBuild.currentResult
                    def jobName = env.JOB_NAME
                    def buildNumber = env.BUILD_NUMBER
                    def buildUrl = env.BUILD_URL
                    def date = new Date().format("yyyy-MM-dd HH:mm:ss")
                    
                    // Create task description with test results and links
                    def taskDescription = """**Test Execution Summary**\n- **Job**: ${jobName}\n- **Build**: #${buildNumber}\n- **Status**: ${testResult}\n- **Date**: ${date}\n- **Build URL**: ${buildUrl}\n- **Allure Report**: ${buildUrl}allure\n\n${testResult == 'SUCCESS' ? '✅ All tests passed successfully.' : '❌ Some tests failed. Please check the report for details.'}"""

                    // Task name
                    def taskName = "Test Results: ${jobName} #${buildNumber} - ${testResult}"
                    def taskStatus = testResult == 'SUCCESS' ? 'complete' : 'to do'
                    def taskPriority = testResult == 'SUCCESS' ? 3 : 1  // 1=Urgent, 2=High, 3=Normal, 4=Low
                    
                    // Create the JSON directly in Groovy
                    def taskJson = """
                    {
                        "name":"${taskName}",
                        "description":"${taskDescription}",
                        "status":"${taskStatus}",
                        "priority":${taskPriority},
                        "due_date":${System.currentTimeMillis() + 86400000},
                        "tags":["automated-test","${testResult.toLowerCase()}"],
                        "assignees":[${CLICKUP_USER_ID}]
                    }
                    """
                    
                    // Get list ID from the parent task
                    def listId = ""
                    try {
                        def parentTaskResponse = sh(
                            script: "curl -s -X GET 'https://api.clickup.com/api/v2/task/${CLICKUP_PARENT_TASK_ID}' -H 'Authorization: ${CLICKUP_API_TOKEN}' -H 'Content-Type: application/json'",
                            returnStdout: true
                        ).trim()
                        
                        echo "Response received from ClickUp API (length: ${parentTaskResponse.length()})"
                        
                        // Extract list ID using Groovy
                        def matcher = parentTaskResponse =~ /"list":\{"id":"([0-9]+)"/
                        if (matcher.find()) {
                            listId = matcher.group(1)
                            echo "Using list ID: ${listId}"
                        } else {
                            echo "Error: Could not extract list ID"
                            return
                        }
                    } catch (Exception e) {
                        echo "Error getting parent task info: ${e.message}"
                        return
                    }
                    
                    // Create the task
                    def taskResponse = ""
                    try {
                        // Create a temporary file for the JSON
                        writeFile file: 'task.json', text: taskJson
                        
                        // Create the task using the JSON file
                        taskResponse = sh(
                            script: "curl -X POST 'https://api.clickup.com/api/v2/list/${listId}/task' -H 'Authorization: ${CLICKUP_API_TOKEN}' -H 'Content-Type: application/json' -d @task.json",
                            returnStdout: true
                        ).trim()
                        
                        // Save list ID for bug ticket creation
                        sh "echo ${listId} > /tmp/clickup_list_id"
                    } catch (Exception e) {
                        echo "Error creating task: ${e.message}"
                        return
                    }
                    
                    echo "Created ClickUp task: ${taskName} and assigned to QA Engineer"
                    
                    // If tests failed, also create a bug ticket
                    if (testResult != 'SUCCESS') {
                        // Analyze test results to find failures
                        def failedTests = []
                        try {
                            // Use shell commands instead of findFiles
                            def testFilesOutput = sh(
                                script: "find ${ALLURE_RESULTS_DIR} -name '*.json' | grep -v 'categories\\|environment\\|history\\|executor\\|testrun' || true",
                                returnStdout: true
                            ).trim()
                            
                            // Process each test file found
                            if (testFilesOutput) {
                                testFilesOutput.split('\n').each { filePath ->
                                    if (filePath) {
                                        def content = readFile(filePath)
                                        def testStatus = (content =~ /"status":"([^"]*)"/)
                                        if (testStatus.find() && (testStatus.group(1) == "failed" || testStatus.group(1) == "broken")) {
                                            def testName = (content =~ /"name":"([^"]*)"/) 
                                            def testPath = (content =~ /"fullName":"([^"]*)"/)
                                            def testMsg = (content =~ /"message":"([^"]*)"/)
                                            
                                            def testDetails = [:]
                                            testDetails.name = testName.find() ? testName.group(1) : "Unknown test"
                                            testDetails.path = testPath.find() ? testPath.group(1) : ""
                                            testDetails.message = testMsg.find() ? testMsg.group(1) : ""
                                            
                                            failedTests.add(testDetails)
                                        }
                                    }
                                }
                            }
                        } catch (Exception e) {
                            echo "Error analyzing test results: ${e.message}"
                        }
                        
                        // Get failed test details from the Allure report
                        def bugTitle = "BUG: Test Failures in ${jobName} #${buildNumber}"
                        
                        // Deduplicate failures to prevent repetition
                        def uniqueFailures = [:]
                        failedTests.each { test ->
                            // Create a key that combines test name, location, and error message
                            def key = "${test.name}:${test.path}:${test.message}"
                            
                            // Store only unique failures with counts
                            if (uniqueFailures.containsKey(key)) {
                                uniqueFailures[key].count++
                            } else {
                                test.count = 1
                                uniqueFailures[key] = test
                            }
                        }
                        
                        // Format the failed tests
                        def failedTestsFormatted = ""
                        if (uniqueFailures.size() > 0) {
                            uniqueFailures.values().each { test ->
                                failedTestsFormatted += "\n\n**Failed Test:** ${test.name}"
                                if (test.path) {
                                    failedTestsFormatted += "\n**Location:** ${test.path}"
                                }
                                if (test.message) {
                                    failedTestsFormatted += "\n**Error Message:** ${test.message}"
                                }
                                if (test.count > 1) {
                                    failedTestsFormatted += "\n**Occurrences:** ${test.count} times"
                                }
                            }
                        } else {
                            failedTestsFormatted = "\n- Unknown test failures - see report for details"
                        }
                        
                        // Create the bug description
                        def bugDescription = """**Bug Report - Test Failures**

**Job**: ${jobName}
**Build**: #${buildNumber}
**Status**: Failed
**Date**: ${date}

**Failed Tests**:${failedTestsFormatted}

**Links**:
- [Jenkins Build](${buildUrl})
- [Allure Report](${buildUrl}allure)"""
                        
                        // Create the bug ticket JSON
                        def bugJson = """
                        {
                            "name":"${bugTitle}",
                            "description":"${bugDescription.replaceAll('"', '\\\\"').replaceAll('\n', '\\\\n')}",
                            "status":"to do",
                            "priority":1,
                            "tags":["bug","automated-test"],
                            "assignees":[${CLICKUP_USER_ID}]
                        }
                        """
                        
                        // Create the bug ticket
                        def bugResponse = ""
                        def taskId = ""
                        
                        try {
                            // Create a temporary file for the JSON
                            writeFile file: 'bug_ticket.json', text: bugJson
                            
                            // Create the bug ticket
                            bugResponse = sh(
                                script: "curl -X POST 'https://api.clickup.com/api/v2/list/${listId}/task' -H 'Authorization: ${CLICKUP_API_TOKEN}' -H 'Content-Type: application/json' -d @bug_ticket.json",
                                returnStdout: true
                            ).trim()
                            
                            // Extract task ID from the response
                            def taskIdMatcher = bugResponse =~ /"id":"([^"]*)"/
                            if (taskIdMatcher.find()) {
                                taskId = taskIdMatcher.group(1)
                                echo "Created bug ticket with ID: ${taskId}"
                            }
                        } catch (Exception e) {
                            echo "Error creating bug ticket: ${e.message}"
                            return
                        }
                        
                        // Attach screenshots if available
                        if (taskId && fileExists("${PLAYWRIGHT_TEST_RESULTS_DIR}")) {
                            try {
                                // Extract test names that failed (for matching screenshots)
                                def failedTestNames = []
                                failedTests.each { test ->
                                    // Extract test name without spaces and special characters for matching
                                    def normalizedName = test.name.replaceAll(/[^a-zA-Z0-9]/, "").toLowerCase()
                                    if (normalizedName) {
                                        failedTestNames.add(normalizedName)
                                    }
                                    
                                    // Also add test path components which might be in screenshot names
                                    if (test.path) {
                                        test.path.split(/[\/\\]/).each { pathPart ->
                                            def normalized = pathPart.replaceAll(/[^a-zA-Z0-9]/, "").toLowerCase()
                                            if (normalized && normalized.length() > 3) { // Avoid short/common words
                                                failedTestNames.add(normalized)
                                            }
                                        }
                                    }
                                }
                                
                                echo "Looking for screenshots related to failed tests: ${failedTestNames.join(', ')}"
                                
                                // Use shell command to find screenshots 
                                def screenshotsOutput = sh(
                                    script: "find ${PLAYWRIGHT_TEST_RESULTS_DIR} -name '*.png' -type f || true",
                                    returnStdout: true
                                ).trim()
                                
                                if (screenshotsOutput) {
                                    def uploadedScreenshots = 0
                                    def processedFiles = [] // Track already processed files
                                    
                                    // Helper function to extract test identifier from path
                                    def extractTestId = { String path ->
                                        def fileName = path.tokenize('/').last()
                                        def dirName = path.tokenize('/')[-2]
                                        
                                        // First try to extract meaningful test ID from directory name
                                        def testId = ""
                                        def matcher = dirName =~ /([A-Za-z0-9-]+(?:-retry\d+)?)$/
                                        if (matcher.find()) {
                                            testId = matcher.group(1)
                                        }
                                        
                                        return [testId: testId, fileName: fileName, dirName: dirName]
                                    }
                                    
                                    // Process screenshots from failed tests (test-failed-*.png files)
                                    def failedTestScreenshots = screenshotsOutput.split('\n').findAll { path ->
                                        path && path.toLowerCase().contains("test-failed")
                                    }
                                    
                                    // Group screenshots by test (using directory as the key)
                                    def screenshotsByTest = [:]
                                    failedTestScreenshots.each { path ->
                                        if (fileExists(path) && !processedFiles.contains(path)) {
                                            def info = extractTestId(path)
                                            def key = info.dirName
                                            
                                            if (!screenshotsByTest.containsKey(key)) {
                                                screenshotsByTest[key] = []
                                            }
                                            screenshotsByTest[key] << path
                                        }
                                    }
                                    
                                    // Upload one screenshot for each failed test
                                    screenshotsByTest.each { testKey, screenshots ->
                                        // Find the best screenshot (usually test-failed-1.png)
                                        def bestScreenshot = screenshots.find { it.contains("test-failed-1.png") } ?: screenshots.first()
                                        
                                        echo "Attaching screenshot for test ${testKey}: ${bestScreenshot}"
                                        sh "curl -X POST 'https://api.clickup.com/api/v2/task/${taskId}/attachment' -H 'Authorization: ${CLICKUP_API_TOKEN}' -F 'attachment=@${bestScreenshot}'"
                                        uploadedScreenshots++
                                        processedFiles.add(bestScreenshot)
                                    }
                                    
                                    // If we didn't find any test-failed screenshots, use filename-based matching
                                    if (uploadedScreenshots == 0) {
                                        def matchedFilenames = []
                                        
                                        screenshotsOutput.split('\n').each { path ->
                                            if (path && fileExists(path) && !processedFiles.contains(path)) {
                                                def pathLower = path.toLowerCase()
                                                def fileName = path.tokenize('/').last().toLowerCase()
                                                
                                                // Skip diff images and already processed tests
                                                if (!fileName.contains("-diff") && !fileName.contains("_diff")) {
                                                    // Find which test this screenshot belongs to
                                                    def matchedTest = failedTestNames.find { testName ->
                                                        pathLower.contains(testName) && !matchedFilenames.contains(testName)
                                                    }
                                                    
                                                    if (matchedTest) {
                                                        echo "Attaching screenshot for test ${matchedTest}: ${path}"
                                                        sh "curl -X POST 'https://api.clickup.com/api/v2/task/${taskId}/attachment' -H 'Authorization: ${CLICKUP_API_TOKEN}' -F 'attachment=@${path}'"
                                                        uploadedScreenshots++
                                                        processedFiles.add(path)
                                                        matchedFilenames.add(matchedTest)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    
                                    // Final fallback - upload any failure-related screenshots we haven't uploaded yet
                                    if (uploadedScreenshots == 0) {
                                        screenshotsOutput.split('\n').each { path ->
                                            if (path && fileExists(path) && !processedFiles.contains(path)) {
                                                def fileName = path.tokenize('/').last().toLowerCase()
                                                
                                                // Check for common failure indicators in filename
                                                if (fileName.contains("fail") || fileName.contains("error") || fileName.contains("assertion")) {
                                                    echo "Attaching failure screenshot: ${path}"
                                                    sh "curl -X POST 'https://api.clickup.com/api/v2/task/${taskId}/attachment' -H 'Authorization: ${CLICKUP_API_TOKEN}' -F 'attachment=@${path}'"
                                                    uploadedScreenshots++
                                                    processedFiles.add(path)
                                                }
                                            }
                                        }
                                    }
                                    
                                    echo "Uploaded ${uploadedScreenshots} screenshots related to failed tests"
                                }
                            } catch (Exception e) {
                                echo "Error attaching screenshots: ${e.message}"
                            }
                        }
                        
                        echo "Created BUG ticket: ${bugTitle} and assigned to QA Engineer"
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            emailext (
                subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                body: """
                    <p>Pipeline execution failed:</p>
                    <p>Status: ${currentBuild.currentResult}</p>
                    <p>Build URL: ${BUILD_URL}</p>
                    
                    <p>Error Details:</p>
                    <pre>
                    ${currentBuild.description ?: 'No description available'}
                    </pre>
                """,
                to: "enuqidzebeqa@gmail.com",
                attachLog: true,
                compressLog: true
            )
            echo 'Pipeline failed. Check the logs for details.'
            echo 'Visual comparison failures detected. Please check the test report for details.'
        }
    }
}
