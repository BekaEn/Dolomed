pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS_PATH = '0'
        GIT_SSL_NO_VERIFY = 'true'  // If using self-signed certificates
        GIT_LFS_SKIP_SMUDGE = '1'  // Skip LFS smudge during checkout
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        retry(3)  // Retry the entire pipeline up to 3 times
    }

    stages {
        stage('Setup Git LFS') {
            steps {
                sh '''
                    # Install Git LFS using Homebrew
                    brew install git-lfs || true
                    
                    # Verify Git LFS installation
                    git lfs version || echo "Git LFS not installed"
                    
                    # Initialize Git LFS
                    git lfs install || true
                '''
            }
        }

        stage('Checkout') {
            steps {
                retry(3) {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            credentialsId: 'github-pat',  // Updated to use PAT
                            url: 'https://github.com/BekaEn/Dolomed.git'
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

        stage('Pull Git LFS') {
            steps {
                sh '''
                    # Pull LFS files
                    git lfs pull || echo "Git LFS pull failed"
                    
                    # List LFS files
                    git lfs ls-files || echo "No LFS files found"
                '''
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