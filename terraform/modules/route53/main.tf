# A record (IPv4) → CloudFront alias
resource "aws_route53_record" "frontend_a" {
  zone_id = var.hosted_zone_id
  name    = "${var.subdomain}.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_hosted_zone
    evaluate_target_health = false
  }
}

# AAAA record (IPv6) → CloudFront alias
resource "aws_route53_record" "frontend_aaaa" {
  zone_id = var.hosted_zone_id
  name    = "${var.subdomain}.${var.domain_name}"
  type    = "AAAA"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_hosted_zone
    evaluate_target_health = false
  }
}
