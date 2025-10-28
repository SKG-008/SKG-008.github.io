# AWS Setup Guide for Virtual.Market

This guide will help you set up the AWS services needed for the Virtual.Market property listing website.

## 1. DynamoDB Setup

1. Go to AWS Console > DynamoDB
2. Click "Create table"
3. Enter table details:
   - Table name: `PropertyListings`
   - Partition key: `id` (String)
4. Leave other settings as default and click "Create table"

## 2. Lambda Functions Setup

### Create GetListings Lambda

1. Go to AWS Console > Lambda
2. Click "Create function"
3. Select "Author from scratch"
4. Enter function details:
   - Function name: `getListings`
   - Runtime: Node.js 14.x
5. Click "Create function"
6. Copy code from `getListings.js` into the code editor
7. Click "Deploy"

### Create AddListing Lambda

1. Click "Create function"
2. Select "Author from scratch"
3. Enter function details:
   - Function name: `addListing`
   - Runtime: Node.js 14.x
4. Click "Create function"
5. Copy code from `addListing.js` into the code editor
6. Click "Deploy"
7. In the "Function overview" section, click "Add layer"
8. Select "AWS Layers" and search for "uuid"
9. Select the latest version of the UUID layer and click "Add"

### Create DeleteListing Lambda

1. Click "Create function"
2. Select "Author from scratch"
3. Enter function details:
   - Function name: `deleteListing`
   - Runtime: Node.js 14.x
4. Click "Create function"
5. Copy code from `deleteListing.js` into the code editor
6. Click "Deploy"

## 3. IAM Permissions

For each Lambda function, add the following permissions:

1. Go to the Lambda function
2. Click on the "Configuration" tab
3. Click on "Permissions"
4. Click on the role name under "Execution role"
5. Click "Add permissions" > "Create inline policy"
6. Switch to the JSON editor and paste the appropriate policy:

### GetListings Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "dynamodb:Scan",
            "Resource": "arn:aws:dynamodb:*:*:table/PropertyListings"
        }
    ]
}
```

### AddListing Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "dynamodb:PutItem",
            "Resource": "arn:aws:dynamodb:*:*:table/PropertyListings"
        }
    ]
}
```

### DeleteListing Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "dynamodb:DeleteItem",
            "Resource": "arn:aws:dynamodb:*:*:table/PropertyListings"
        }
    ]
}
```

## 4. API Gateway Setup

1. Go to AWS Console > API Gateway
2. Click "Create API"
3. Select "REST API" and click "Build"
4. Enter API details:
   - API name: `PropertyListingsAPI`
   - Endpoint Type: Regional
5. Click "Create API"

### Create Resources and Methods

1. Click "Actions" > "Create Resource"
2. Resource Name: `listings`
3. Click "Create Resource"

#### GET Method
1. With the `/listings` resource selected, click "Actions" > "Create Method"
2. Select "GET" and click the checkmark
3. Integration type: Lambda Function
4. Lambda Function: `getListings`
5. Click "Save"
6. Click "OK" when prompted to give permission

#### POST Method
1. With the `/listings` resource selected, click "Actions" > "Create Method"
2. Select "POST" and click the checkmark
3. Integration type: Lambda Function
4. Lambda Function: `addListing`
5. Click "Save"
6. Click "OK" when prompted to give permission

#### DELETE Method
1. Click "Actions" > "Create Resource"
2. Resource Path: `{id}`
3. Resource Name: `id`
4. Click "Create Resource"
5. With the `/listings/{id}` resource selected, click "Actions" > "Create Method"
6. Select "DELETE" and click the checkmark
7. Integration type: Lambda Function
8. Lambda Function: `deleteListing`
9. Click "Save"
10. Click "OK" when prompted to give permission

### Enable CORS
1. Select the `/listings` resource
2. Click "Actions" > "Enable CORS"
3. Check all the methods (GET, POST, OPTIONS)
4. Click "Enable CORS and replace existing CORS headers"
5. Click "Yes, replace existing values"
6. Repeat for the `/listings/{id}` resource

### Deploy API
1. Click "Actions" > "Deploy API"
2. Deployment stage: [New Stage]
3. Stage name: `prod`
4. Click "Deploy"
5. Note the "Invoke URL" at the top of the page - you'll need this for your frontend

## 5. Update Frontend Code

1. Open `api.js` in your project
2. Replace `YOUR_API_GATEWAY_ID` and `YOUR_REGION` with your actual API Gateway ID and AWS region
   - Example: `https://abc123def.execute-api.us-east-1.amazonaws.com/prod`

## 6. Test Your Setup

1. Deploy your frontend to GitHub Pages or your preferred hosting
2. Test adding, viewing, and deleting listings
3. Verify that listings persist and are visible to all users