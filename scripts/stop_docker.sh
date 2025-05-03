echo "➡️ Starting Docker container..."

docker stop $(docker ps -a -q)

docker rm $(docker ps -a -q)

echo "✅ Docker container stopped and removed."