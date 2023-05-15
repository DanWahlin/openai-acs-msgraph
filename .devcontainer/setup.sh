# Needed to work around public port issue that causes CORS to fail
echo "gh codespace ports -c $CODESPACE_NAME" >> ~/.bashrc