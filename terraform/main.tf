terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "socio-connect-tfstate-985385108943"
    key            = "calendar-app/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "socio-connect-terraform-locks"
  }
}

# Primary region provider
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# ACM certificates for CloudFront MUST be in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# ─── ACM Certificate (us-east-1 for CloudFront) ───────────────────────────────

module "acm" {
  source = "./modules/acm"

  providers = {
    aws = aws.us_east_1
  }

  domain_name               = "${var.subdomain}.${var.domain_name}"
  subject_alternative_names = ["www.${var.subdomain}.${var.domain_name}"]
  hosted_zone_id            = data.aws_route53_zone.main.zone_id
  environment               = var.environment
}

# ─── S3 Bucket ────────────────────────────────────────────────────────────────

module "s3" {
  source = "./modules/s3"

  bucket_name = "${var.project_name}-${var.environment}-frontend"
  environment = var.environment
}

# ─── CloudFront Distribution ──────────────────────────────────────────────────

module "cloudfront" {
  source = "./modules/cloudfront"

  s3_bucket_id                = module.s3.bucket_id
  s3_bucket_regional_domain   = module.s3.bucket_regional_domain_name
  s3_bucket_arn               = module.s3.bucket_arn
  oac_id                      = module.s3.oac_id
  acm_certificate_arn         = module.acm.certificate_arn
  domain_names                = ["${var.subdomain}.${var.domain_name}"]
  price_class                 = var.cloudfront_price_class
  environment                 = var.environment

  depends_on = [module.acm]
}

# ─── Route 53 DNS Records ────────────────────────────────────────────────────

module "route53" {
  source = "./modules/route53"

  hosted_zone_id          = data.aws_route53_zone.main.zone_id
  subdomain               = var.subdomain
  domain_name             = var.domain_name
  cloudfront_domain_name  = module.cloudfront.distribution_domain_name
  cloudfront_hosted_zone  = module.cloudfront.distribution_hosted_zone_id
}

# ─── CI/CD Pipeline ───────────────────────────────────────────────────────────

module "codepipeline" {
  source = "./modules/codepipeline"

  project_name               = var.project_name
  environment                = var.environment
  aws_region                 = var.aws_region
  github_owner               = var.github_owner
  github_repo                = var.github_repo
  github_branch              = var.github_branch
  s3_bucket_name             = module.s3.bucket_id
  cloudfront_distribution_id = module.cloudfront.distribution_id
  nx_app_name                = var.nx_app_name

  depends_on = [module.s3, module.cloudfront]
}

# ─── Data Sources ─────────────────────────────────────────────────────────────

data "aws_route53_zone" "main" {
  name         = var.domain_name
  private_zone = false
}
