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
        stage('Checkout') {
            steps {
                retry(3) {  // Retry checkout up to 3 times
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            credentialsId: '9d609d65-d222-4236-86bc-08cbce4c422b',
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
                            [$class: 'LocalBranch', localBranch: 'main'],
                            [$class: 'GitLFSPull']
                        ]
                    ])
                }
            }
        }

        stage('Setup Git LFS') {
            steps {
                sh '''
                    # Install Git LFS if not already installed
                    if ! command -v git-lfs &> /dev/null; then
                        if [[ "$OSTYPE" == "darwin"* ]]; then
                            brew install git-lfs
                        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                            curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
                            sudo apt-get install git-lfs
                        fi
                    fi
                    
                    # Initialize Git LFS
                    git lfs install
                    
                    # Pull LFS files
                    git lfs pull
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