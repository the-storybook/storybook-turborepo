def startTime = new Date()

pipeline {
    agent any

    environment {
        // use some parameter store for this
        REGISTRY = "registry.derpstack.com"
        IMAGE_NAME = "storybook-service"
        DEPLOY_SERVER = "ubuntu@141.148.219.136"
        CONTAINER_NAME = "storybook-service-main"
        DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1352279747975053343/VAfIMLqO5veatQh2Nun62u6yqNx_fDujV8RCx1STdaeIzZxQt8VHw_7IUT9tqL0ZwMp6"
    }

    stages {

        stage('Check Branch') {
            when {
                expression { env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    echo "Building on ${env.BRANCH_NAME} branch"
                }
            }
        }

        stage('Clean Workspace') {
            steps {
                cleanWs()
                sh 'git config --global --add safe.directory /var/jenkins_home/workspace'
            }
        }
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Create Docker Image') {
            steps {
                sh "cd deployments/dev/ && docker build -t $REGISTRY/$IMAGE_NAME:latest ../../"
            }
        }

        stage('Push to Private Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry', usernameVariable: 'DOCKER_REGISTRY_USER', passwordVariable: 'DOCKER_REGISTRY_PASS')]) {
                    sh "echo $DOCKER_REGISTRY_PASS | docker login $REGISTRY -u $DOCKER_REGISTRY_USER --password-stdin"
                    sh "docker push $REGISTRY/$IMAGE_NAME:latest"
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                sshagent(['jenkins-server-private-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no $DEPLOY_SERVER \\
                        "cd /home/ubuntu/jenkins/storybook/api && \\
                        docker pull $REGISTRY/$IMAGE_NAME:latest && \\
                        docker compose stop
                        docker compose up -d"
                    """
                }
            }
        }
    }

    post {
        success {
            script {
                def endTime = new Date()
                def timeZone = TimeZone.getTimeZone("Asia/Kolkata")
                def startIST = startTime.format("yyyy-MM-dd HH:mm:ss z", timeZone)
                def endIST = endTime.format("yyyy-MM-dd HH:mm:ss z", timeZone)

                def currentTime = new Date()
                def currentIST = currentTime.format("yyyy-MM-dd HH:mm:ss z", timeZone)

                def durationSeconds = (endTime.getTime() - startTime.getTime()) / 1000

                def isoFormat = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
                isoFormat.setTimeZone(timeZone)

                def sentIST = isoFormat.format(new Date())

                def message = """
                {
                    "embeds": [
                        {
                            "color": 4321431,
                            "timestamp": "${sentIST}",
                            "url": "${BUILD_URL}",
                            "author": {
                                "url": "https://jenkins.derpstack.com",
                                "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/226px-Jenkins_logo.svg.png",
                                "name": "Jenkins Status Reporter"
                            },
                            "footer": {
                                "text": "Eventasaurus | Your best event management tool"
                            },
                            "fields": [
                                {
                                    "name": "Status",
                                    "value": "✅ Success",
                                    "inline": false
                                },
                                {
                                    "name": "Initiated At",
                                    "value": "⏳ ${startIST}",
                                    "inline": true
                                },
                                {
                                    "name": "Completed At",
                                    "value": "✅ ${endIST}",
                                    "inline": true
                                },
                                {
                                    "name": "Time Taken",
                                    "value": "⏱ ${durationSeconds} seconds",
                                    "inline": true
                                }
                            ],
                            "title": "# ${BUILD_NUMBER} | ${JOB_NAME}"
                        }
                    ]
                }
                """.trim()

                // ✅ Debug JSON Output
                echo "JSON Payload: ${message}"

                // ✅ Corrected curl command using single quotes properly
                sh """
                curl -X POST -H "Content-Type: application/json" -d '${message.replace("'", "\\'")}' $DISCORD_WEBHOOK_URL
                """

            }
        }
        failure {
            script {
                def endTime = new Date()
                def timeZone = TimeZone.getTimeZone("Asia/Kolkata")
                def startIST = startTime.format("yyyy-MM-dd HH:mm:ss z", timeZone)
                def endIST = endTime.format("yyyy-MM-dd HH:mm:ss z", timeZone)

                def durationSeconds = (endTime.getTime() - startTime.getTime()) / 1000

                def isoFormat = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
                isoFormat.setTimeZone(timeZone)
                def sentIST = isoFormat.format(new Date())

                def message = """
                {
                    "embeds": [
                        {
                            "color": 15879747,
                            "timestamp": "${sentIST}",
                            "url": "${BUILD_URL}",
                            "author": {
                                "url": "https://jenkins.derpstack.com",
                                "icon_url": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg",
                                "name": "Jenkins Status Reporter"
                            },
                            "footer": {
                                "text": "Eventasaurus | Your best event management tool"
                            },
                            "fields": [
                                {
                                    "name": "Status",
                                    "value": "❌ Failure",
                                    "inline": false
                                },
                                {
                                    "name": "Initiated At",
                                    "value": "⏳ ${startIST}",
                                    "inline": true
                                },
                                {
                                    "name": "Completed At",
                                    "value": "✅ ${endIST}",
                                    "inline": true
                                },
                                {
                                    "name": "Time Taken",
                                    "value": "⏱ ${durationSeconds} seconds",
                                    "inline": true
                                }
                            ],
                            "title": "# ${BUILD_NUMBER} | ${JOB_NAME}"
                        }
                    ]
                }
                """.trim()

                // ✅ Debug JSON Output
                echo "JSON Payload: ${message}"

                // ✅ Corrected curl command using single quotes properly
                sh """
                curl -X POST -H "Content-Type: application/json" -d '${message.replace("'", "\\'")}' $DISCORD_WEBHOOK_URL
                """

            }
        }
    }
}
