pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/NobleGeek/trackit-minor-project.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deployment step here!'
            }
        }
    }
}
