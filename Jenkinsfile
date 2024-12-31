pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'votre_nom_utilisateur_dockerhub/react-quiz-app'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git url: 'https://github.com/votre-projet/React-Quiz-App.git', branch: 'main'
            }
        }

        stage('SonarQube Analysis') {
            environment {
                SCANNER_HOME = tool 'SonarQube Scanner'
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=React-Quiz-App -Dsonar.sources=src"
                }
            }
        }

        stage('Build Project') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_IMAGE:$DOCKER_TAG .'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
                        sh 'docker push $DOCKER_IMAGE:$DOCKER_TAG'
                    }
                }
            }
        }

        stage('Deploy and Run') {
            steps {
                sh 'docker stop react-quiz-app-container || true'
                sh 'docker rm react-quiz-app-container || true'
                sh 'docker run -d --name react-quiz-app-container -p 3000:3000 $DOCKER_IMAGE:$DOCKER_TAG'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for more details.'
        }
    }
}
