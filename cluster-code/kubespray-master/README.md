Before start , we assume  below components are created : 


##### VPC cration for EKS cluster: 

In order to run EKS, one must create 3 subnets in at least 3 availbility zone.

3 smaller "public" subnets, that can be used for external ingress etc. And
3 larger subnets that will be used for the Pod network, internal ingress and
worker nodes.

In this example the following subnets would be created:

| zone         | public        | private        |
|--------------|---------------|----------------|
| `us-east-1a` | `10.0.0.0/22` | `10.0.32.0/19` |
| `us-east-1b` | `10.0.4.0/22` | `10.0.64.0/19` |
| `us-east-1c` | `10.0.8.0/22` | `10.0.96.0/19` |

- VPC with Public and Private Subnets in # Availability Zones
- Bastion Hosts and NAT Gateways in the Public Subnet
- A dynamic number of masters, etcd, and worker nodes in the Private Subnet
- even distributed over the # of Availability Zones
- AWS ELB in the Public Subnet for accessing the Kubernetes API from the internet

-------------------------------------------------------------------------------------------------------------------


# Deploy a Production Ready Kubernetes Cluster


To deploy the cluster we need :

### Ansible

5 host, 3 Worker + master, 5 worker , 1 Ansible host machine 

#### Usage
Install dependencies from ``requirements.txt``
1. sudo pip3 install -r requirements.txt

Copy ``inventory/sample`` as ``inventory/mycluster``
2. cp -rfp inventory/sample inventory/mycluster

Update Ansible inventory file with inventory builder
3. declare -a IPS=(10.10.1.3 10.10.1.4 10.10.1.5)
4. CONFIG_FILE=inventory/mycluster/hosts.yaml python3 contrib/inventory_builder/inventory.py ${IPS[@]}

 Review and change parameters under ``inventory/mycluster/group_vars``
5. cat inventory/mycluster/group_vars/all/all.yml
6. cat inventory/mycluster/group_vars/k8s-cluster/k8s-cluster.yml

Deploy Kubespray with Ansible Playbook - run the playbook as root

7. ansible-playbook -i inventory/mycluster/hosts.yaml  --become --become-user=root cluster.yml



Note: When Ansible is already installed via system packages on the control machine, other python packages installed via `sudo pip install -r requirements.txt` will go to a different directory tree (e.g. `/usr/local/lib/python2.7/dist-packages` on Ubuntu) from Ansible's (e.g. `/usr/lib/python2.7/dist-packages/ansible` still on Ubuntu).
As a consequence, `ansible-playbook` command will fail with:


ERROR! no action detected in task. This often indicates a misspelled module name, or incorrect module path.

probably pointing on a task depending on a module present in requirements.txt (i.e. "unseal vault").

One way of solving this would be to uninstall the Ansible package and then, to install it via pip but it is not always possible.
A workaround consists of setting `ANSIBLE_LIBRARY` and `ANSIBLE_MODULE_UTILS` environment variables respectively to the `ansible/modules` and `ansible/module_utils` subdirectories of pip packages installation location, which can be found in the Location field of the output of `pip show [package]` before executing `ansible-playbook`.





Linux Distributions used: 

- **Ubuntu** 16.04, 18.04



## Requirements

- **Minimum required version of Kubernetes is v1.16**
- **Ansible v2.9+ and  python-netaddr is installed on the machine that will run Ansible commands**
- The target servers must have **access to the Internet** in order to pull docker images. Otherwise, additional configuration is required (See [Offline Environment](docs/offline-environment.md))
- The target servers are configured to allow **IPv4 forwarding**.
- **Your ssh key must be copied** to all the servers part of your inventory.
- If kubespray is ran from non-root user account, correct privilege escalation method
    should be configured in the target servers. Then the `ansible_become` flag
    or command parameters `--become or -b` should be specified.

Hardware:
These limits are safe guarded by Kubespray. Actual requirements for your workload can differ. For a sizing guide go to the [Building Large Clusters](https://kubernetes.io/docs/setup/cluster-large/#size-of-master-and-master-components) guide.

- Master
  - Memory: 1500 MB
- Node
  - Memory: 1024 MB
  
Master/worker : m5.large


