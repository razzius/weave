set path (dirname (status --current-filename))
cat $path/razzi.json | http -vvv post http://localhost:5000/api/profile
