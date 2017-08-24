# soap-component [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Generic SOAP / WebServices integration component

# soap-component
SOAP component component for the [elastic.io platform](http://www.elastic.io &#34;elastic.io platform&#34;)

## Authentication

This component currently supports Baisc authentication, so credentials are like this:

![image](https://user-images.githubusercontent.com/56208/29668549-ed6ef326-88e0-11e7-9a56-67193056ada8.png)

As you may see you need following data:
* WSDL URL - this field is mandatory. WSDL is required if you want to call a SOAP service. It should be a readable URL.
* Username - optional username
* Password - optional password

Only if both ``username`` and ``password`` will be given, then Basic authentication header 
[will be added](https://github.com/elasticio/soap-component/blob/master/lib/actions/call.js#L32) to the SOAP call. 
You may also extend this component and add more authentication methods, see 
[node-soap documentation](https://github.com/vpulim/node-soap#security) on that topic

## Getting Started

After registration and uploading of your SSH Key you can proceed to deploy it into our system. At this stage we suggest you to:
* [Create a team](http://docs.elastic.io/docs/teams) to work on your new component. This is not required but will be automatically created using random naming by our system so we suggest you name your team accordingly.
* [Create a repository](http://docs.elastic.io/docs/component-repositories) where your new component is going to *reside* inside the team that you have just created.

Now as you have a team name and component repository name you can add a new git remote where code shall be pushed to. It is usually displayed on the empty repository page:

```bash
$ git remote add elasticio your-team@git.elastic.io:your-repository.git
```

Obviously the naming of your team and repository is entirely upto you and if you do not put any corresponding naming our system will auto generate it for you but the naming might not entirely correspond to your project requirements.
Now we are ready to push it:

```bash
$ git push elasticio master
```

## Authentication

Currently you would need to specify URL of your WSDL in your credentials.
 
## Known issues & limitations

There are following limitations & known issues:
* Only SOAP bindings are supported, HTTP bindings are not supported

See more documentation on [node-soap](https://github.com/vpulim/node-soap).


## License

Apache-2.0 © [elastic.io GmbH](https://elastic.io)


[npm-image]: https://badge.fury.io/js/soap-component.svg
[npm-url]: https://npmjs.org/package/soap-component
[travis-image]: https://travis-ci.org/elasticio/soap-component.svg?branch=master
[travis-url]: https://travis-ci.org/elasticio/soap-component
[daviddm-image]: https://david-dm.org/elasticio/soap-component.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/elasticio/soap-component
