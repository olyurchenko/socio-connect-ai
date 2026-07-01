output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidations)"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_distribution_domain" {
  description = "CloudFront distribution domain name"
  value       = module.cloudfront.distribution_domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name for CI/CD uploads"
  value       = module.s3.bucket_id
}

output "site_url" {
  description = "Full HTTPS URL of the deployed application"
  value       = "https://${var.subdomain}.${var.domain_name}"
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN"
  value       = module.acm.certificate_arn
}

output "codepipeline_name" {
  description = "CodePipeline name — use this to monitor builds in the AWS Console"
  value       = module.codepipeline.pipeline_name
}

output "github_connection_arn" {
  description = "CodeStar GitHub connection ARN — activate once in AWS Console before first push"
  value       = module.codepipeline.github_connection_arn
}

output "github_connection_status" {
  description = "CodeStar GitHub connection status (PENDING until manually activated)"
  value       = module.codepipeline.github_connection_status
}

output "google_maps_api_key_parameter_name" {
  description = "SSM Parameter Store name holding the Google Maps API key"
  value       = aws_ssm_parameter.google_maps_api_key.name
}
