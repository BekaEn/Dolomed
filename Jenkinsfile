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
        EMAIL_RECIPIENTS = 'enuqidzebeqa@gmail.com'
        ALLURE_RESULTS_DIR = "allure-results"
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
        stage('Setup Git LFS') {
            steps {
                sh '''
                    /opt/homebrew/bin/brew install git-lfs
                    which git-lfs
                    git-lfs version
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
                        # Clone the repository using HTTPS with token
                        git clone "https://${GIT_USERNAME}:${GITHUB_TOKEN}@github.com/BekaEn/Dolomed.git" .
                        
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
                    /opt/homebrew/bin/brew install node@${NODE_VERSION}
                    echo 'export PATH="/opt/homebrew/opt/node@${NODE_VERSION}/bin:$PATH"' >> ~/.bash_profile
                    source ~/.bash_profile
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    export PATH="/opt/homebrew/opt/node@${NODE_VERSION}/bin:$PATH"
                    npm install
                    npx playwright install --with-deps
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    export PATH="/opt/homebrew/opt/node@${NODE_VERSION}/bin:$PATH"
                    mkdir -p ${ALLURE_RESULTS_DIR}
                    npx playwright test --reporter=line,allure-playwright
                '''
            }
            post {
                always {
                    script {
                       allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
  
                        
                        // Create ZIP with all reports
                        sh """
                            mkdir -p ${PLAYWRIGHT_TEST_RESULTS_DIR}
                            zip -r test-reports.zip \
                                ${PLAYWRIGHT_TEST_REPORT_DIR}/ \
                                ${PLAYWRIGHT_TEST_RESULTS_DIR}/ \
                                ${ALLURE_RESULTS_DIR}/ || true
                        """
                    }
                }
            }
        }

        stage('Generate Reports') {
            steps {
                sh '''
                    export PATH="/opt/homebrew/opt/node@${NODE_VERSION}/bin:$PATH"
                    allure generate allure-results -o allure-report --clean
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: "allure-report/**/*"
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