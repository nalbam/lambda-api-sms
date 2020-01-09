# output

output "url" {
  value = "https://${module.dev-lambda.domain}/sms"
}

output "invoke_url" {
  value = "${module.dev-lambda.invoke_url}"
}
