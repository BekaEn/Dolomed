pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS_PATH = '0'
        GIT_SSL_NO_VERIFY = 'true'
        GIT_USERNAME = 'BekaEn'
        GIT_PASSWORD = credentials('github-credentials')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        retry(3)
    }

    stages {
        stage('Setup Environment') {
            steps {
                sh '''
                    # Install Git LFS
                    brew install git-lfs || true
                    
                    # Initialize Git LFS
                    git lfs install || true
                    
                    # Configure Git LFS
                    git config --global filter.lfs.clean "git-lfs clean -- %f"
                    git config --global filter.lfs.smudge "git-lfs smudge -- %f"
                    git config --global filter.lfs.process "git-lfs filter-process"
                    git config --global filter.lfs.required true
                    
                    # Configure Git credentials
                    git config --global user.name "${GIT_USERNAME}"
                    git config --global credential.helper store
                    echo "https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com" > ~/.git-credentials
                    
                    # Verify Git LFS installation
                    git lfs version || echo "Git LFS not installed"
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
                            [$class: 'DisableRemotePoll']
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