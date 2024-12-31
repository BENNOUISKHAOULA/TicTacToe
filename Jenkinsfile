pipeline {
    agent any  // Exécute sur n'importe quel agent disponible

    environment {
        DOCKER_IMAGE = 'tic-tac-toe-app'
        DOCKER_TAG = 'latest'
        DOCKER_HUB_REPO = 'kbiiis/tic-tac-toe-app'
    }

    stages {
        // 1. Cloner le dépôt
        stage('Clone Repository') {
            steps {
                script {
                    git url: 'https://github.com/BENNOUISKHAOULA/TicTacToe.git', branch: 'main'
                }
            }
        }

        // 2. Analyse du code (avec SonarQube si nécessaire)
        stage('Code Analysis') {
            steps {
                echo "Analyse du code (optionnel)"
                // withSonarQubeEnv('SonarQube') {
                //     sh 'npm run sonar'  // Nécessite sonar dans package.json
                // }
            }
        }

        // 3. Construire l'image Docker
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        // 4. Exécuter les tests avec Docker
        stage('Run Tests') {
            steps {
                script {
                    docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").inside {
                        sh 'npm run test'
                    }
                }
            }
        }

        // 5. Pousser l'image vers Docker Hub
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        // 6. Déployer l'application avec Docker
        stage('Deploy and Run') {
            steps {
                script {
                    sh """
                    docker stop ${DOCKER_IMAGE} || true
                    docker rm ${DOCKER_IMAGE} || true
                    docker run -d --name ${DOCKER_IMAGE} -p 3000:3000 ${DOCKER_HUB_REPO}:${DOCKER_TAG}
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Déploiement réussi 🚀'
        }
        failure {
            echo 'La pipeline a échoué ❌'
        }
    }
}
