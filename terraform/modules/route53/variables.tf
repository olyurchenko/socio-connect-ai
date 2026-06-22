variable "hosted_zone_id" {
  description = "Route 53 hosted zone ID"
  type        = string
}

variable "subdomain" {
  description = "Subdomain prefix"
  type        = string
}

variable "domain_name" {
  description = "Root domain name"
  type        = string
}

variable "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  type        = string
}

variable "cloudfront_hosted_zone" {
  description = "CloudFront hosted zone ID (fixed per region)"
  type        = string
}
