pipeline {
    agent any
    stages {
    
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test -- --passWithNoTests'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deployment step here!'
            }
        }
    }
}
