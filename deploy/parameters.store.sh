#!/bin/sh
APPLICATION_NAME=$(printf '%s\n' "${APPLICATION_NAME}")
CONFIG_ENVIRONMENT=$(printf '%s\n' "${CONFIG_ENVIRONMENT}")
REGION=$(printf '%s\n' "${AWS_REGION}")

JSON=$(cat ./deploy/parameters.${CONFIG_ENVIRONMENT}.json) 

echo "$JSON" 

PARAMETER_NAME="$APPLICATION_NAME-$CONFIG_ENVIRONMENT.json" 

aws ssm put-parameter --name $PARAMETER_NAME --type "String" --value "$JSON" --region $REGION --overwrite