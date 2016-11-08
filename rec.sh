#!/bin/bash
FULL_PATH=$(git rev-parse --show-toplevel)

cd "$FULL_PATH/system/campaigns"
npm install --save
cd "$FULL_PATH/system/find"
npm install --save
cd "$FULL_PATH/system/products"
npm install --save
cd "$FULL_PATH/system/stores"
npm install --save
cd "$FULL_PATH/system/users"
npm install --save

cd "$FULL_PATH/process/accounts"
npm install --save
cd "$FULL_PATH/process/engagement"
npm install --save
cd "$FULL_PATH/process/location"
npm install --save
cd "$FULL_PATH/process/marketing"
npm install --save
cd "$FULL_PATH/process/warehouse"
npm install --save
cd "$FULL_PATH/process/stores-management"
npm install --save

cd "$FULL_PATH/experience/mobile-api"
npm install --save
cd "$FULL_PATH/experience/web-api"
npm install --save

