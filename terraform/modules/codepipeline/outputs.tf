output "pipeline_name" {
  description = "CodePipeline name"
  value       = aws_codepipeline.main.name
}

output "pipeline_arn" {
  description = "CodePipeline ARN"
  value       = aws_codepipeline.main.arn
}

output "github_connection_arn" {
  description = "CodeStar GitHub connection ARN — must be activated manually in AWS Console before the pipeline can run"
  value       = aws_codestarconnections_connection.github.arn
}

output "github_connection_status" {
  description = "CodeStar GitHub connection status (PENDING until activated in AWS Console)"
  value       = aws_codestarconnections_connection.github.connection_status
}

output "codebuild_build_project_name" {
  description = "CodeBuild build project name"
  value       = aws_codebuild_project.build.name
}

output "codebuild_deploy_project_name" {
  description = "CodeBuild deploy project name"
  value       = aws_codebuild_project.deploy.name
}

output "artifacts_bucket_name" {
  description = "S3 bucket used to store pipeline artifacts"
  value       = aws_s3_bucket.pipeline_artifacts.bucket
}
