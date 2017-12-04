Name:           cloudify-stage
Version:        %{CLOUDIFY_VERSION}
Release:        %{CLOUDIFY_PACKAGE_RELEASE}%{?dist}
Summary:        Cloudify Stage
Group:          Applications/Multimedia
License:        Apache 2.0
URL:            https://github.com/cloudify-cosmo/cloudify-stage
Vendor:         Cloudify Inc.
Packager:       Cloudify Inc.

Requires:       nodejs
BuildRequires:  %{requires}, git

%description
Cloudify's REST Service.


%prep

%build
cd ${RPM_SOURCE_DIR}
sudo npm install webpack -g
sudo npm install bower -g
sudo npm install gulp -g
sudo npm install grunt-cli -g
npm install
bower install --allow-root
pushd semantic
        gulp build
popd
pushd backend
        npm install
popd
webpack --config webpack.config-prod.js --bail

%install

mkdir -p %{buildroot}/opt/cloudify-stage
cp ${RPM_SOURCE_DIR} %{buildroot}/opt/cloudify-stage -fr

%pre
%post
%preun
%postun


%files

/opt/cloudify-stage
