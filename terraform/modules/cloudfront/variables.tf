variable "s3_bucket_id" {
  description = "S3 bucket name"
  type        = string
}

variable "s3_bucket_regional_domain" {
  description = "S3 bucket regional domain name"
  type        = string
}

variable "s3_bucket_arn" {
  description = "S3 bucket ARN"
  type        = string
}

variable "oac_id" {
  description = "CloudFront Origin Access Control ID"
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN (must be in us-east-1)"
  type        = string
}

variable "domain_names" {
  description = "Alternate domain names (CNAMEs) for the CloudFront distribution"
  type        = list(string)
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "access_log_bucket" {
  description = "Optional S3 bucket for CloudFront access logs"
  type        = string
  default     = null
}
