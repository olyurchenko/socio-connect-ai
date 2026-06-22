variable "domain_name" {
  description = "Primary domain for the certificate"
  type        = string
}

variable "subject_alternative_names" {
  description = "Additional domains for the certificate"
  type        = list(string)
  default     = []
}

variable "hosted_zone_id" {
  description = "Route 53 hosted zone ID for DNS validation records"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}
