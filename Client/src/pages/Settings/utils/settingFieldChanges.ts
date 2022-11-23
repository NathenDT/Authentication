export default function (
  firstName: SettingsTextFieldValues,
  lastName: SettingsTextFieldValues,
  email: SettingsTextFieldValues,
  username: SettingsTextFieldValues
) {
  let res: any = {}

  if (firstName.text !== firstName.original) res.first_name = firstName.text
  if (lastName.text !== lastName.original) res.last_name = lastName.text
  if (email.text !== email.original) res.email = email.text
  if (username.text !== username.original) res.username = username.text

  return res
}
