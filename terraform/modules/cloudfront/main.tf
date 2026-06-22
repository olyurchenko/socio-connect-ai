locals {
  s3_origin_id = "S3-${var.s3_bucket_id}"
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = var.price_class
  aliases             = var.domain_names
  http_version        = "http2and3"
  comment             = "CDN for ${var.s3_bucket_id} (${var.environment})"
  wait_for_deployment = false

  # ─── S3 Origin with OAC ──────────────────────────────────────────────────────
  origin {
    domain_name              = var.s3_bucket_regional_domain
    origin_id                = local.s3_origin_id
    origin_access_control_id = var.oac_id
  }

  # ─── Default Cache Behaviour (serve static assets) ───────────────────────────
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # ─── SPA Routing: serve index.html for all non-file paths ────────────────────
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  # ─── HTTPS via ACM ───────────────────────────────────────────────────────────
  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # ─── Logging (optional) ──────────────────────────────────────────────────────
  dynamic "logging_config" {
    for_each = var.access_log_bucket != null ? [1] : []
    content {
      bucket          = "${var.access_log_bucket}.s3.amazonaws.com"
      include_cookies = false
      prefix          = "cloudfront/${var.environment}/"
    }
  }
}
