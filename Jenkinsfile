pipeline {
    agent any

    environment {
        // AWS setup
        AWS_DEFAULT_REGION = 'us-east-1'
        S3_BUCKET = 'jenkins-demo-frontend-bucket' 

        // App Server setup
        APP_SERVER_IP = '1.2.3.4' // Replace with actual IP
        APP_SERVER_USER = 'ec2-user'
        SSH_CREDENTIAL_ID = 'app-server-ssh-key' // ID of the credential in Jenkins
    }

    tools {
        // defined in Jenkins global tool configuration
        maven 'Maven 3.9.6' 
        nodejs 'NodeJS 20'
    }

    stages {
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Backend (EC2)') {
            steps {
                sshagent([SSH_CREDENTIAL_ID]) {
                    // Copy jar and Dockerfile
                    sh "scp -o StrictHostKeyChecking=no backend/target/*.jar ${APP_SERVER_USER}@${APP_SERVER_IP}:/home/${APP_SERVER_USER}/app.jar"
                    sh "scp -o StrictHostKeyChecking=no backend/Dockerfile ${APP_SERVER_USER}@${APP_SERVER_IP}:/home/${APP_SERVER_USER}/Dockerfile"
                    
                    // Run Docker commands on remote server
                    sh """
                        ssh -o StrictHostKeyChecking=no ${APP_SERVER_USER}@${APP_SERVER_IP} '
                            # Create network if not exists
                            docker network create jenkins-net || true

                            # Run Postgres
                            docker stop postgres-db || true
                            docker rm postgres-db || true
                            docker run -d --name postgres-db \\
                                --network jenkins-net \\
                                -e POSTGRES_USER=postgres \\
                                -e POSTGRES_PASSWORD=password \\
                                -e POSTGRES_DB=mydb \\
                                -v postgres-data:/var/lib/postgresql/data \\
                                postgres:15

                            # Build and Run Backend
                            docker build -t spring-backend .
                            docker stop spring-backend || true
                            docker rm spring-backend || true
                            docker run -d --name spring-backend \\
                                --network jenkins-net \\
                                -p 8080:8080 \\
                                -e DB_HOST=postgres-db \\
                                spring-backend
                        '
                    """
                }
            }
        }

        stage('Deploy Frontend (S3)') {
            steps {
                dir('frontend') {
                    withAWS(credentials: 'aws-credentials', region: AWS_DEFAULT_REGION) {
                        sh "aws s3 sync dist/ s3://${S3_BUCKET} --delete"
                    }
                }
            }
        }
    }
}
