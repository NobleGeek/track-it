pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
               
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
