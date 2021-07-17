# **BeeScreens** - LibreNMS

The **N**etwork **M**onitoring **S**ystem allows to monitor and check the overall system's health. It can help to detect failing devices, such as over-heating or disks failure.

## Additional configuration

- [Pi Network Monitoring](https://funprojects.blog/2018/06/24/pi-network-monitoring/)

On the Raspberry Pi, execute the following commands to install and configure SNMP protocol:

```sh
# Install the SNMP daemon
sudo apt install --yes snmpd

# Enable the SNMP service on boot
sudo systemctl enable snmpd

# Start the SNMP service
sudo systemctl start snmpd

# Create the SNMP daemon configuration
sudo tee /etc/snmp/snmpd.conf > /dev/null <<EOT
###############################################################################
#
#  AGENT BEHAVIOUR
#

#  Listen for connections on all interfaces (both IPv4 *and* IPv6)
agentAddress udp:161,udp6:[::1]:161

###############################################################################
#
#  ACCESS CONTROL
#

#  system + hrSystem groups only
view   systemonly  included   .1.3.6.1.2.1.1
view   systemonly  included   .1.3.6.1.2.1.25.1

#  Full read-only from public
rocommunity public

###############################################################################
#
#  SYSTEM INFORMATION
#

#  Note that setting these values here, results in the corresponding MIB objects being 'read-only'
#  See snmpd.conf(5) for more details
sysLocation    Sitting on the Dock of the Bay
sysContact     Me <me@example.org>
# Application + End-to-End layers
sysServices    72

#
#  Process Monitoring
#
                               # At least one  'mountd' process
proc  mountd
                               # No more than 4 'ntalkd' processes - 0 is OK
proc  ntalkd    4
                               # At least one 'sendmail' process, but no more than 10
proc  sendmail 10 1

#  Walk the UCD-SNMP-MIB::prTable to see the resulting output
#  Note that this table will be empty if there are no "proc" entries in the snmpd.conf file

#
#  Disk Monitoring
#
                               # 10MBs required on root disk, 5% free on /var, 10% free on all other disks
disk       /     10000
disk       /var  5%
includeAllDisks  10%

#  Walk the UCD-SNMP-MIB::dskTable to see the resulting output
#  Note that this table will be empty if there are no "disk" entries in the snmpd.conf file

#
#  System Load
#
                               # Unacceptable 1-, 5-, and 15-minute load averages
load   12 10 5

###############################################################################
#
#  ACTIVE MONITORING
#

#   send SNMPv1  traps
trapsink     localhost public

#
#  Event MIB - automatically generate alerts
#

# generate traps on UCD error conditions
defaultMonitors          yes
# generate traps on linkUp/Down
linkUpDownNotifications  yes
EOT

# Restart SNMP service
sudo systemctl restart snmpd

# Allow SNMP through the firewall
sudo ufw allow snmp
```

## Additional resources

- [Net-SNMP](http://www.net-snmp.org/) - Net-SNMP is a suite of applications used to implement SNMP v1, SNMP v2c and SNMP v3 using both IPv4 and IPv6.
- [LibreNMS](https://www.librenms.org/) - A fully featured network monitoring system.
