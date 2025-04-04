pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS_PATH = '0'
        GIT_SSL_NO_VERIFY = 'true'
        GIT_USERNAME = 'BekaEn'
        GITHUB_TOKEN = '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'
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
        PLAYWRIGHT_TEST_REPORT_DIR = "playwright-report"
        PLAYWRIGHT_TEST_RESULTS_DIR = "test-results"
    }

    options {
        // timeout(time: 30, unit: 'MINUTES')
        // retry(3)
        skipDefaultCheckout()
    }

    stages {
        stage('Setup Git LFS') {
            steps {
                sh '''
                    # Install Git LFS using Homebrew
                    /opt/homebrew/bin/brew install git-lfs
                    
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
                retry(3) {
                    sh '''
                        # Clone the repository using HTTPS with token
                        git clone "https://${GIT_USERNAME}:${GITHUB_TOKEN}@github.com/BekaEn/Dolomed.git" .
                        
                        # Initialize Git LFS in the repository
                        git lfs install
                        
                        # Pull LFS files
                        git lfs pull
                    '''
                }
            }
        }

        stage('Setup Node.js') {
            steps {
                sh '''
                    # Install Node.js using Homebrew
                    /opt/homebrew/bin/brew install node@${NODE_VERSION}
                    
                    # Add Node.js to PATH
                    echo 'export PATH="/opt/homebrew/opt/node@${NODE_VERSION}/bin:$PATH"' >> ~/.bash_profile
                    source ~/.bash_profile
                    
                    # Verify Node.js installation
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    # Ensure Node.js is in PATH
                    export PATH="/opt/homebrew/opt/node@${NODE_VERSION}/bin:$PATH"
                    
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
                    # Ensure Node.js is in PATH
                    export PATH="/opt/homebrew/opt/node@${NODE_VERSION}/bin:$PATH"
                    
                    # Create test results directory
                    mkdir -p ${PLAYWRIGHT_TEST_RESULTS_DIR}
                    
                    # Run tests with detailed reporting
                    npm run test -- --reporter=junit,line --output=${PLAYWRIGHT_TEST_RESULTS_DIR}/junit-results.xml
                '''
            }
            post {
                always {
                    junit "${PLAYWRIGHT_TEST_RESULTS_DIR}/junit-results.xml"
                    archiveArtifacts artifacts: "${PLAYWRIGHT_TEST_RESULTS_DIR}/**/*"
                    archiveArtifacts artifacts: "${PLAYWRIGHT_TEST_REPORT_DIR}/**/*"
                }
                success {
                    echo 'All tests passed!'
                }
                failure {
                    echo 'Some tests failed. Check the test results for details.'
                    sh '''
                        export PATH="/opt/homebrew/opt/node@${NODE_VERSION}/bin:$PATH"
                        echo "Failed tests:"
                        cat ${PLAYWRIGHT_TEST_RESULTS_DIR}/junit-results.xml | grep "failure" || true
                        echo "Generating detailed test report..."
                        npm run test:report
                    '''
                }
            }
        }

        stage('Generate Report') {
            steps {
                sh '''
                    # Ensure Node.js is in PATH
                    export PATH="/opt/homebrew/opt/node@${NODE_VERSION}/bin:$PATH"
                    npm run test:report
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: "${PLAYWRIGHT_TEST_REPORT_DIR}/**/*"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
            echo 'Visual comparison failures detected. Please check the test report for details.'
        }
    }
} 