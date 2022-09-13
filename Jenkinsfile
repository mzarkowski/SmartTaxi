pipeline {
  agent any
  stages {
    stage('Build base') {
      parallel {
        stage('Build base') {
          steps {
            sh 'echo ""'
          }
        }

        stage('Test') {
          steps {
            sh 'echo 1'
          }
        }

      }
    }

    stage('build: web') {
      parallel {
        stage('build: web') {
          steps {
            sh 'echo "1"'
          }
        }

        stage('build: api') {
          steps {
            sh 'echo "1"'
          }
        }

        stage('build: restapi') {
          steps {
            sh 'echo "1"'
          }
        }

        stage('build: worker') {
          steps {
            sh 'echo "1"'
          }
        }

      }
    }

    stage('test') {
      steps {
        sh 'echo "1"'
      }
    }

    stage('') {
      steps {
        sh 'echo "1"'
      }
    }

    stage('promote: approve?') {
      steps {
        sh 'echo "1"'
      }
    }

    stage('promote: prod') {
      steps {
        sh 'echo "1"'
      }
    }

  }
}