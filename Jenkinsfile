pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS_PATH = '0'
        GIT_SSL_NO_VERIFY = 'true'  // If using self-signed certificates
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        retry(3)  // Retry the entire pipeline up to 3 times
    }

    stages {
        stage('Checkout') {
            steps {
                retry(3) {  // Retry checkout up to 3 times
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            credentialsId: 'git-credentials',  // Your Git credentials ID
                            url: 'YOUR_REPOSITORY_URL'
                        ]],
                        extensions: [
                            [$class: 'CleanBeforeCheckout'],
                            [$class: 'CloneOption', 
                             timeout: 10,
                             shallow: true,
                             noTags: true,
                             reference: ''
                            ],
                            [$class: 'LocalBranch', localBranch: 'main']
                        ]
                    ])
                }
            }
        }

        stage('Setup Node.js') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS-${NODE_VERSION}') {
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test'
            }
            post {
                always {
                    junit 'test-results/junit-results.xml'
                    archiveArtifacts artifacts: 'test-results/**/*'
                }
                success {
                    echo 'All tests passed!'
                }
                failure {
                    echo 'Some tests failed. Check the test results for details.'
                    sh 'npm run test:failed'
                }
            }
        }

        stage('Generate Report') {
            steps {
                sh 'npm run test:report'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'playwright-report/**/*'
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
        }
    }
} 