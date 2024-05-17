## Installation via RPM

Follow the instructions below for RPM installation:

**Amazon Linux 2**

Amazon Linux 2 is suitable for various use cases, including traditional applications and cloud-native workloads. This makes it an adaptable option for developers leveraging AWS services.

Step 1: Install Swift on Amazon Linux 2 using RPM packages by running this command for experimental use only:

```bash
$ curl https://download.swift.org/experimental-use-only/repo/amazonlinux/releases/2/swiftlang.repo > /etc/yum.repos.d/swiftlang.repo
$ amazon-linux-extras install epel
$ yum install swiftlang
```

Step 2. Verify the installation by checking the Swift version:
```
$ swift —version
```

**CentOS 7**

Using RPM packages for Swift on CentOS 7 provides a structured and efficient way to deploy Swift on CentOS systems, leveraging the benefits of package management tools and practices prevalent in the CentOS ecosystem.

Step 1: Install Swift on CentOS 7 using RPM packages by running this command for experimental use only:

```bash
$ curl https://download.swift.org/experimental-use-only/repo/centos/releases/7/swiftlang.repo > /etc/yum.repos.d/swiftlang.repo
$ yum install epel-release
$ yum install swiftlang
```
Step 2. Verify the installation by checking the Swift version:
```
$ swift —version
```
