output "fqdn" {
  description = "Fully qualified domain name of the frontend"
  value       = aws_route53_record.frontend_a.fqdn
}

output "record_a_name" {
  description = "A record name"
  value       = aws_route53_record.frontend_a.name
}
