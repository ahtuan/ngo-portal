pipeline {
    agent any
    tools {
        nodejs '20.10.0'
    }
    stages {
        stage("Checking build success") {
            parallel {
                stage("Build Client") {
                    steps {
                        dir('client') {
                            bat "bun install"
                            bat "bun run build"
                        }
                    }
                }
                stage("Build Server") {
                    steps {
                        dir('server') {
                            bat "bun install"
                            bat "bun run db:genc"
                        }
                    }
                }
            }
        }
        stage("Move to project folder") {
            steps {
                build job: "Get_code_Ngo_Gom", wait: true
            }
        }
        stage("Deploy") {
            steps {
                echo "Deployingg"
            }
        }
    }
}