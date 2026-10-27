echo "" >> parameter-overrides/.overrides

array=(
  Project
  Stage
  EncryptSecret
  BasicAuthSecret
  RecaptchaEnabled
  RecaptchaSecret
  OllamaUrl
  DbHost
  DbPort
  DbName
  DbUser
  DbPassword
  PrivateSubnetA
  PrivateSubnetB
  LambdaSecurityGroup
)

for i in "${array[@]}"
do
    NAME=$(echo "$i")
    VAL=$(eval echo \${$i})
    echo "${NAME}=\"${VAL}\"" >> parameter-overrides/.overrides
done