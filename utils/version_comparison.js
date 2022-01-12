/**
 * 版本比较
 * @param version 当前版本
 * @param match 目标版本
 * @returns version >= match
 */
function versionComparison(version, match) {
  const versions = version.split('.').map((ver) => parseInt(ver, 10))
  const matches = match.split('.').map((ver) => parseInt(ver, 10))

  const verNum = (versions[0] << 24) | (versions[1] << 16) | (versions[2] << 8)
  const matchNum = (matches[0] << 24) | (matches[1] << 16) | (matches[2] << 8)

  return verNum >= matchNum
}

console.log(versionComparison('9.2.9', '9.3'))
