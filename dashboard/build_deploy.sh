
echo "Building ...."
ng build --prod --base-href ./
echo "Copy to /var/www/html ..."
sudo cp -r dist/front /var/www/html/
sudo chown -R www-data:www-data /var/www/html/front
echo "Done..."

