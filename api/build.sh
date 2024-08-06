set -e

# Install system dependencies
apt-get update && apt-get install -y \
  build-essential \
  libmariadb-dev

# Upgrade pip, setuptools, and wheel
pip install --upgrade pip setuptools wheel

# Install Python dependencies
pip install -r requirements.txt