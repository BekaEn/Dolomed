pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS_PATH = '0'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
    }
} 