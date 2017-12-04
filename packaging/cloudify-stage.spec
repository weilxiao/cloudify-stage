Name:           cloudify-stage
Version:        %{CLOUDIFY_VERSION}
Release:        %{CLOUDIFY_PACKAGE_RELEASE}%{?dist}
Summary:        Cloudify Stage
Group:          Applications/Multimedia
License:        Apache 2.0
URL:            https://github.com/cloudify-cosmo/cloudify-stage
Vendor:         Cloudify Inc.
Packager:       Cloudify Inc.

Requires:       nodejs == 6
BuildRequires:  %{requires}

%description
Cloudify's REST Service.


%prep

%build
npm install webpack -g
npm install bower -g
npm install gulp -g
npm install grunt-cli -g
npm install
bower install
pushd semantic
	gulp build
popd
pushd backend
	npm install
popd
webpack --config webpack.config-prod.js --bail

%install

mkdir -p %{buildroot}/opt/cloudify-stage
cp . %{buildroot}/opt/cloudify-stage

%pre
%post
%preun
%postun


%files

/opt/cloudify-stage
