echo "" >> parameter-overrides/.overrides

array=(
  Project
  Stage
  EncryptSecret
  BasicAuthSecret
  RecaptchaEnabled
  RecaptchaSecret
  OllamaUrl
)

for i in "${array[@]}"
do
    NAME=$(echo "$i")
    VAL=$(eval echo \${$i})
    echo "${NAME}=\"${VAL}\"" >> parameter-overrides/.overrides
done