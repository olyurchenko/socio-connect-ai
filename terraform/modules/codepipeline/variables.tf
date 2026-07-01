variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "github_owner" {
  description = "GitHub repository owner (username or org)"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch to watch for changes"
  type        = string
  default     = "master"
}

variable "s3_bucket_name" {
  description = "S3 bucket name to deploy frontend assets into"
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation after deploy"
  type        = string
}

variable "nx_app_name" {
  description = "Nx application name to build"
  type        = string
  default     = "calendar-app"
}

variable "google_maps_api_key_parameter_name" {
  description = "SSM Parameter Store name holding the Google Maps API key, fetched by CodeBuild at build time"
  type        = string
}
