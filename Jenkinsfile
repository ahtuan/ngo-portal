pipeline {
    agent {
        label 'server-01'
    }
    tools {
        nodejs '20.10.0'
    }
    stages {
        stage("Check lint Client") {
            steps {
                dir('client') {
                    bat "bun install"
                    bat "bun run lint"
                }
            }
        }
        stage("Move to project folder") {
            steps {
                build job: "Get_code_Ngo_Gom", wait: true
            }
        }
        stage("Build") {
            parallel {
                stage("Build for client") {
                    steps {
                        dir('D:\\NgoGom\\client') {
                            bat "bun install"
                            bat "bun run build"
                        }
                    }
                }
                stage("Build for server") {
                    steps {
                        dir('D:\\NgoGom\\server') {
                            bat "bun install"
                            bat "bun run db:genc"
                            bat "bun run db:migrate"
                        }
                    }
                }
            }
        }
        stage('Run Application') {
            steps {
                dir('D:\\NgoGom') {
                    echo "Manually run client and server ..."
                }
            }
        }
    }
}