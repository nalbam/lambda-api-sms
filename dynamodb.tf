# dynamodb

resource "aws_dynamodb_table" "dynamodb" {
  name           = "${var.stage}-${var.name}"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "id"
  range_key      = "phone_number"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "phone_number"
    type = "S"
  }

  tags = {
    Name = "${var.stage}-${var.name}"
  }
}
