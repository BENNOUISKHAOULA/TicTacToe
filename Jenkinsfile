pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'kbiiis/tic-tac-toe-app'
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials'
        SONARQUBE_SERVER = 'sonarqube-token'
    }

    stages {
        stage('Clone Project') {
            steps {
                script {
                    echo 'Cloning project...'
                    retry(3) {  // Réessaye 3 fois en cas d'échec
                        checkout scmGit(
                            branches: [[name: '*/main']], 
                            userRemoteConfigs: [[url: 'https://github.com/BENNOUISKHAOULA/TicTacToe', credentialsId: 'dockerhub-credentials']], 
                            shallow: true
                        )
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server-name') {
                    sh './gradlew sonarqube'
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                sh './gradlew build'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    echo 'Building Docker Image...'
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    echo 'Pushing Docker Image to DockerHub...'
                    withDockerRegistry([credentialsId: "$DOCKER_HUB_CREDENTIALS"]) {
                        sh 'docker push $DOCKER_IMAGE'
                    }
                }
            }
        }

        stage('Deploy and Start Container') {
            steps {
                script {
                    echo 'Deploying Docker Container...'
                    sh 'docker stop react-quiz-container || true'
                    sh 'docker rm react-quiz-container || true'
                    sh 'docker run -d --name react-quiz-container -p 8080:80 $DOCKER_IMAGE'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline terminé'
        }
    }
}
