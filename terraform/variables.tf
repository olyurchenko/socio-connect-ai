variable "aws_region" {
  description = "Primary AWS region for deployment"
  type        = string
  default     = "eu-west-1"
}

variable "project_name" {
  description = "Project name used for resource naming and tagging"
  type        = string
  default     = "socio-connect"
}

variable "environment" {
  description = "Deployment environment (production, staging, development)"
  type        = string
  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "environment must be one of: production, staging, development"
  }
}

variable "domain_name" {
  description = "Root domain name (e.g. example.com) — must have a Route 53 hosted zone"
  type        = string
}

variable "subdomain" {
  description = "Subdomain for the calendar app (e.g. calendar)"
  type        = string
  default     = "calendar"
}

variable "github_owner" {
  description = "GitHub repository owner (username or org)"
  type        = string
  default     = "olyurchenko"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "socio-connect-ai"
}

variable "github_branch" {
  description = "GitHub branch to watch — pipeline triggers on every push to this branch"
  type        = string
  default     = "main"
}

variable "nx_app_name" {
  description = "Nx application name to build and deploy"
  type        = string
  default     = "calendar-app"
}

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
  validation {
    condition = contains([
      "PriceClass_All",
      "PriceClass_200",
      "PriceClass_100"
    ], var.cloudfront_price_class)
    error_message = "cloudfront_price_class must be PriceClass_All, PriceClass_200, or PriceClass_100"
  }
}
