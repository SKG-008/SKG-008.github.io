# AWS S3 Setup for Image Storage

## 1. Create S3 Bucket

1. Go to AWS Console > S3
2. Click "Create bucket"
3. Bucket name: `virtual-market-images` (must be globally unique)
4. Region: Choose your preferred region
5. Uncheck "Block all public access" 
6. Check "I acknowledge that the current settings might result in this bucket and the objects within becoming public"
7. Click "Create bucket"

## 2. Configure Bucket Policy

1. Go to your bucket > Permissions tab
2. Click "Bucket policy"
3. Add this policy (replace BUCKET_NAME with your actual bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::BUCKET_NAME/*"
        }
    ]
}
```

## 3. Configure CORS

1. Go to your bucket > Permissions tab
2. Click "Cross-origin resource sharing (CORS)"
3. Add this configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## 4. Create Upload Lambda Function

1. Go to AWS Console > Lambda
2. Create function: `uploadImage`
3. Runtime: Node.js 14.x
4. Copy code from `uploadImage.js`
5. Add environment variable: `BUCKET_NAME` = `virtual-market-images`

## 5. IAM Permissions for Lambda

Add this policy to your Lambda execution role:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::virtual-market-images/*"
        }
    ]
}
```

## 6. Add API Gateway Endpoint

1. In your existing API Gateway
2. Create new resource: `/upload-image`
3. Create POST method
4. Connect to `uploadImage` Lambda function
5. Enable CORS
6. Deploy API

## 7. Update Frontend

Update the `API_URL` in `api.js` to include your new endpoint.

## Benefits

- **Performance**: Images load faster from S3 CDN
- **Storage**: Unlimited image storage
- **Cost**: Pay only for what you use
- **Reliability**: 99.999999999% durability