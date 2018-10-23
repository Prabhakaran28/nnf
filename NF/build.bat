if exist NeuralFront_Deployment rmdir NeuralFront_Deployment
ng build --prod
mkdir NeuralFront_Deployment
xcopy server NeuralFront_Deployment\server /s /e /i /Y
xcopy package.json NeuralFront_Deployment\package.json
xcopy server.js NeuralFront_Deployment\server.js
xcopy dist NeuralFront_Deployment /s /e /i /Y