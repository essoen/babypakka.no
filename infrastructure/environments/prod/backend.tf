terraform {
  backend "s3" {
    bucket         = "babypakka-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "eu-north-1"
    dynamodb_table = "babypakka-terraform-locks"
    encrypt        = true
  }
}
