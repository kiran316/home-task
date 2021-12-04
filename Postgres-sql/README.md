# kubernetes-postgresql
Kubernetes Statefullset manifests for PostgreSQL
├── client
│   ├── client-pod.yaml
│   └── psql-client.yaml
├── pgpool
│   ├── nginx.yaml
│   ├── pgpool-deployment.yaml
│   ├── pgpool-secret.yaml
│   ├── pgpool-svc-nodeport.yaml
│   └── pgpool-svc.yaml
└── postgresql
    ├── postgres-configmap.yaml
    ├── postgres-headless-svc.yaml
    ├── postgres-secrets.yaml
    └── postgres-statefulset.yaml


Pre-requisites: 
Creation of storage in NFS server 

### Following steps involved to create one NFS server and attached the Master nodes
On host machine (NFS server):
sudo su -
yum install nfs-utils
systemctl enable nfs-server
systemctl start nfs-server

  
vi /etc/exports
/srv/nfs/kubedata    *(rw,sync,no_subtree_check,insecure)

mkdir -p /srv/nfs/kubedata 
mkdir /srv/nfs/kubedata/{pv0,pv1,pv2,pv3}  
chmod 777 /srv/nfs
exportfs -rav
showmount -v 

On master node:
mount -t nfs host-machine_ip:/srv/nfs/kubēdata /mnt
ls /mnt 

NFS directory created with volume PV0,PV1,PV2,PV3
=================================================================================================
Following commands have been used to deploy cluster :

# kubectl create namespace database
# kubectl apply -f postgres-configmap.yaml -n database
# kubectl apply -f postgres-headless-svc.yaml -n database
# kubectl apply -f postgres-secrets.yaml -n database
# kubectl apply -f postgres-statefulset.yaml -n database

REplication manager will take care of primary/master node -read/write replicas 

For Pgool services :

#kubectl create -f pgpool-secret.yaml -n database
# kubectl apply -f pgpool-svc.yaml -n database
# kubectl apply -f pgpool-svc-nodeport.yaml -n database
# kubectl apply -f pgpool-deployment.yaml -n database

Client deployment to access cluster:
# kubectl apply -f psql-client.yaml -n database

kubectl get secret postgres-secrets -n database -o jsonpath="{.data.postgresql-password}" | base64 --decode 

kubectl exec -it pg-client -n database -- /bin/bash

=================================================================================================================